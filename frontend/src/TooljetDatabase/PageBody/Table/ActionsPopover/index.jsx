/* eslint-disable react/jsx-key */
import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import EditIcon from './Icons/Edit.svg';
import CloneIcon from './Icons/Clone.svg';
import PrimaryIcon from './Icons/Primary.svg';
import DeleteIcon from './Icons/Delete.svg';

export const TablePopover = ({ disabled, children, onEdit, onDelete, onDuplicate }) => {
  if (disabled) return children;
  const popover = (
    <Popover id="popover-contained">
      <Popover.Content>
        <div className="row list-group-item-action cursor-pointer">
          <div className="col-auto">
            <EditIcon />
          </div>
          <div className="col text-truncate" onClick={onEdit}>
            Edit
          </div>
        </div>
        <div className="row list-group-item-action cursor-pointer mt-3">
          <div className="col-auto">
            <CloneIcon />
          </div>
          <div className="col text-truncate" onClick={onDuplicate}>
            Duplicate
          </div>
        </div>
        <div className="row list-group-item-action cursor-pointer mt-3">
          <div className="col-auto">
            <PrimaryIcon />
          </div>
          <div className="col text-truncate">Make primary</div>
        </div>
        <div className="row list-group-item-action cursor-pointer mt-3">
          <div className="col-auto">
            <DeleteIcon />
          </div>
          <div className="col text-truncate" onClick={onDelete}>
            Delete column
          </div>
        </div>
      </Popover.Content>
    </Popover>
  );

  return (
    <OverlayTrigger rootClose trigger="click" placement="bottom" overlay={popover}>
      {children}
    </OverlayTrigger>
  );
};