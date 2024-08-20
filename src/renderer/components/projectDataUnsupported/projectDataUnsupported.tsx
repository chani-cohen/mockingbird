import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import { BUTTONS } from '../../../consts/analytics';
import { EVENT_KEYS } from '../../../types/events';
import { emitSocketEvent, reportButtonClick } from '../../utils';

export function ProjectDataUnsupported({
  open,
  onClose,
  projectName,
}: {
  projectName: string;
  open: boolean;
  onClose: () => void;
}) {
  const handleClose = () => {
    reportButtonClick(BUTTONS.DATA_UNSUPPORTED_DIALOG_CLOSE);
    onClose();
  };
  const handleDeleteProject = () => {
    reportButtonClick(BUTTONS.DATA_UNSUPPORTED_DIALOG_DELETE);
    emitSocketEvent(EVENT_KEYS.DELETE_PROJECT, { projectName });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle color="error" id="alert-dialog-title">
        Project Data is unsupported!
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {projectName} project data has been used in a newer version of
          Mockingbird,
        </DialogContentText>
        <DialogContentText id="alert-dialog-description">
          please update your version.
        </DialogContentText>
        <Typography variant="caption">
          For support contact ozkeisar@gmail.com
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Close
        </Button>
        <Button color="error" onClick={handleDeleteProject} autoFocus>
          Delete project
        </Button>
      </DialogActions>
    </Dialog>
  );
}
