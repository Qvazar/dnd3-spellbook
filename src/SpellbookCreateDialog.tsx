import React from "react";
import {
    useState
} from 'react';
import {
    useHistory
} from "react-router-dom";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@material-ui/core";

interface SpellbookCreateDialogProps {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SpellbookCreateDialog: React.FC<SpellbookCreateDialogProps> = ({open, setOpen}) => {
    const history = useHistory();
    const [spellbookName, setSpellbookName] = useState("");

    const handleCancel = () => {
        setSpellbookName("");
        setOpen(false);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        history.push(`spellbooks/${spellbookName}/edit`);
    };

    return (
        <Dialog open={open} onClose={handleCancel} aria-labelledby="spellbookcreatedialog-title">
            <form onSubmit={handleSubmit}>
                <DialogTitle id="spellbookcreatedialog-title">Create new Spellbook</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the name of your new spellbook.
                    </DialogContentText>
                    <TextField required label="Spellbook name" value={spellbookName} onChange={e => setSpellbookName(e.currentTarget.value)} autoFocus={true} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button
                        type="submit"
                        disabled={spellbookName.length === 0}
                        variant="contained"
                        color="primary">
                        Create
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default SpellbookCreateDialog;
