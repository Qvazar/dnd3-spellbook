import React from 'react';

type SpellbookListItemProps = {
    name: string,
    spellClass: string
};

const SpellbookListItem: React.FC<SpellbookListItemProps> = (props : SpellbookListItemProps) => (
    <li className="spellbooklistitem">
        <div className="spellbooklistitem_name">{props.name}</div>
        <div className="spellbooklistitem_spellclass">{props.spellClass}</div>
    </li>
);

type SpellbookListProps = {
    spellbooks: SpellbookListItemProps[]
};

const SpellbookList: React.FC<SpellbookListProps> = (props : SpellbookListProps) => (
    <ul className="spellbooklist">
        {
            props.spellbooks.map(spellbook =>
                <SpellbookListItem 
                    key={spellbook.name} 
                    name={spellbook.name} 
                    spellClass={spellbook.spellClass}
                />
            )
        }
    </ul>
);

export default SpellbookList;
