import React from 'react';
import { List as MUIList, ListItem, ListItemAvatar, ListItemText, Avatar, ListItemSecondaryAction, IconButton, Slide } from '@material-ui/core';
import { Delete, MoneyOff } from '@material-ui/icons';

import useStyles from './styles';

const List = () => {
    const classes = useStyles();

    const transacitons = [];

    return (
        <MUIList dense={false} className={classes.list}>
            {transacitons.map((transaciton) => (
                <Slide direction="down" in mountOnEnter unmountOnExit key={transaciton.id}>
                    <ListItem>
                        <ListItemAvatar>
                            
                        </ListItemAvatar>
                    </ListItem>
                </Slide>
            ))}
        </MUIList>
    )
}

export default List
