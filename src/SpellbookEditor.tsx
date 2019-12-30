import React from 'react';
import {
    Link,
    useParams
} from "react-router-dom";
import {
    Grid,
    MenuItem,
    Select,
    TextField
} from "@material-ui/core";
import ErrorView from "./Error";
import Loading from "./Loading";
import {
    useSpellbook
} from "./spellbookHooks";
import { 
    Spellbook,
    SpellcasterClass
} from "./types";

const SpellbookEditor: React.FC = () => {
    let { spellbookName } = useParams();
    spellbookName = spellbookName || "__null__";

    const {error, spellbook, saveSpellbook} = useSpellbook(spellbookName);

    function handleSpellbookChange<E>(modFn: (sb: Spellbook, e: E) => void) {
        return (e: E) => {
            if (spellbook) {
                modFn(spellbook, e);
                saveSpellbook();
            }
        }
    }

    const handleClassChange = handleSpellbookChange((sb: Spellbook, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value as keyof typeof SpellcasterClass;
        sb.spellcasterClass = SpellcasterClass[value];
    });

    const handleLevelChange = handleSpellbookChange((sb: Spellbook, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        sb.spellcasterLevel = parseInt(value);
    });

    if (error) {
        return <ErrorView error={error} />;
    }

    if (!spellbook) {
        return <Loading />;
    }

    return (
        <form>
            <Grid container direction="column" wrap="nowrap" alignItems="center" >
                <Grid item>
                    <Grid container>
                        <Grid item>
                            <TextField label="Class" value={spellbook.spellcasterClass} select onChange={handleClassChange}>
                                {Object.entries(SpellcasterClass).map(kv => 
                                    <MenuItem key={kv[0]} value={kv[0]}>
                                        {kv[1]}
                                    </MenuItem>
                                )}
                            </TextField>
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Level"
                                value={spellbook.spellcasterLevel}
                                type="number"
                                InputProps={{inputProps:{min:1, max:20}}}
                                onChange={handleLevelChange}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </form>
    );
};

export default SpellbookEditor;
