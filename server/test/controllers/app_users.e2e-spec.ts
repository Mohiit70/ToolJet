import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { authHeaderForUser, clearDB, createApplication, createUser, createNestAppInstance } from '../test.helper';

describe('app_users controller', () => {
  let app: INestApplication;

  beforeEach(async () => {
    await clearDB();
  });

  beforeAll(async () => {
    app = await createNestAppInstance();
  });

  it('should allow only authenticated users to create new app users', async () => {
    await request(app.getHttpServer()).post('/app_users').expect(401);
  });

  it('should be able to create a new app user if admin of same organization', async () => {
    const adminUserData = await createUser(app, { email: 'admin@tooljet.io', role: 'admin' });
    const developerUserData = await createUser(app, {
      email: 'dev@tooljet.io',
      role: 'developer',
      organization: adminUserData.organization,
    });
    const application = await createApplication(app, { user: adminUserData.user });

    const response = await request(app.getHttpServer())
      .post(`/app_users`)
      .set('Authorization', authHeaderForUser(adminUserData.user))
      .send({
        app_id: application.id,
        org_user_id: developerUserData.orgUser.id,
        role: 'admin',
      });

    expect(response.statusCode).toBe(201);
  });

  it('should not be able to create new app user if admin of another organization', async () => {
    const adminUserData = await createUser(app, { email: 'admin@tooljet.io', role: 'admin' });
    // const developerUserData = await createUser(app, { email: 'dev@tooljet.io', role: 'developer', organization: adminUserData.organization });
    const anotherOrgAdminUserData = await createUser(app, { email: 'another@tooljet.io', role: 'admin' });
    const application = await createApplication(app, { name: 'name', user: adminUserData.user });

    const response = await request(app.getHttpServer())
      .post(`/app_users`)
      .set('Authorization', authHeaderForUser(anotherOrgAdminUserData.user))
      .send({
        app_id: application.id,
        org_user_id: adminUserData.orgUser.id,
        role: 'admin',
      });

    expect(response.statusCode).toBe(403);
  });

  it('should not allow developers and viewers to create app users', async () => {
    const adminUserData = await createUser(app, { email: 'admin@tooljet.io', role: 'admin' });
    const application = await createApplication(app, { name: 'name', user: adminUserData.user });

    const developerUserData = await createUser(app, {
      email: 'dev@tooljet.io',
      role: 'developer',
      organization: adminUserData.organization,
    });
    const viewerUserData = await createUser(app, {
      email: 'viewer@tooljet.io',
      role: 'viewer',
      organization: adminUserData.organization,
    });

    let response = await request(app.getHttpServer())
      .post(`/app_users/`)
      .set('Authorization', authHeaderForUser(developerUserData.user))
      .send({
        app_id: application.id,
        org_user_id: viewerUserData.orgUser.id,
        role: 'admin',
      });
    expect(response.statusCode).toBe(403);

    response = response = await request(app.getHttpServer())
      .post(`/app_users/`)
      .set('Authorization', authHeaderForUser(viewerUserData.user))
      .send({
        app_id: application.id,
        org_user_id: developerUserData.orgUser.id,
        role: 'admin',
      });

    await application.reload();
  });

  afterAll(async () => {
    await app.close();
  });
});
