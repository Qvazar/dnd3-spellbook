import React from 'react';
import { Link } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import Error from "./Error";
import Loading from "./Loading";
import { useSpellbooks } from "./spellbookHooks";
import { Spellbook } from "./types";

type SpellbookListItemProps = {
    spellbook: Spellbook
};

const SpellbookListItem: React.FC<SpellbookListItemProps> = ({spellbook}) => (
    <Link to={spellbook.name}>
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

const SpellbookListView: React.FC = () => {
    const [error, spellbooks] = useSpellbooks();

    if (error) {
        return <Error error={error} />;
    }

    if (!spellbooks) {
        return <Loading />;
    }

    return (
        <div className="spellbooklist">
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
            <Fab color="primary" aria-label="add">
                <AddIcon />
            </Fab>
        </div>
    );
};

export default SpellbookListView;
