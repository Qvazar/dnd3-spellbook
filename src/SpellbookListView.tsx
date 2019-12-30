import React from 'react';
import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Fab,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import { makeStyles } from '@material-ui/core/styles';
import Error from "./Error";
import Loading from "./Loading";
import SpellbookCreateDialog from "./SpellbookCreateDialog";
import { useSpellbooks } from "./spellbookHooks";
import { Spellbook } from "./types";

type SpellbookListItemProps = {
    spellbook: Spellbook
};

const SpellbookListItem: React.FC<SpellbookListItemProps> = ({spellbook}) => (
    <Link to={`/spellbooks/${spellbook.name}`}>
        <ListItem className="spellbooklistitem">
            <ListItemText>
                <div className="spellbooklistitem_name">{spellbook.name}</div>
                <div className="spellbooklistitem_spellcaster">
                    <span>{spellbook.spellcasterClass}</span>
                    <span>{spellbook.spellcasterLevel}</span>
                </div>
            </ListItemText>
        </ListItem>
    </Link>
);

const useStyles = makeStyles({
    root: {
        height: "100%"
    }
});

const SpellbookListView: React.FC = () => {
    const [error, spellbooks] = useSpellbooks();
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const classes = useStyles();

    const handleCreate = () => {
        setShowCreateDialog(true);
    };

    if (error) {
        return <Error error={error} />;
    }

    if (!spellbooks) {
        return <Loading />;
    }

    return (
        <Grid container className={classes.root} direction="column" wrap="nowrap">
            <Grid item xs={true}>
                <List>
                    {
                        spellbooks.map(spellbook =>
                            <SpellbookListItem 
                                key={spellbook.name} 
                                spellbook={spellbook}
                            />
                        )
                    }
                </List>
            </Grid>
            <Grid item xs="auto">
                <Grid container justify="center">
                    <Grid item>
                        <Fab color="primary" aria-label="create" onClick={handleCreate}>
                            <AddIcon />
                        </Fab>
                    </Grid>
                </Grid>
            </Grid>
            <SpellbookCreateDialog open={showCreateDialog} setOpen={setShowCreateDialog} />
        </Grid>
    );
};

export default SpellbookListView;
