import React, { useState, useEffect, useContext } from 'react';
import { TextField, Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { ExpenseTrackerContext } from '../../../context/context';
import { v4 as uuidv4 } from 'uuid';
import { useSpeechContext } from '@speechly/react-client';

import useStyles from './styles';
import { categoriesIncome, categoriesExpense } from '../../../constants/categories';
import dateFormat from '../../../utils/dateFormat';
import CustomizedSnackbar from '../../Snackbar/Snackbar';

const initialState = {
    amount: '',
    category: '',
    type: 'Income',
    date: dateFormat(new Date()),
}
const Form = () => {
    const classes = useStyles();
    const [formData, setFormData] = useState(initialState);
    const { addTransaction } = useContext(ExpenseTrackerContext);
    const { segment } = useSpeechContext();
    const [open, setOpen] = React.useState(false);

    const createTransaction = () => {
        if (Number.isNaN(Number(formData.amount)) || !formData.date.includes('-')) return;

        if (categoriesIncome.map((iC) => iC.type).includes(formData.category)) {
            setFormData({ ...formData, type: 'Income' });
          } else if (categoriesExpense.map((iC) => iC.type).includes(formData.category)) {
            setFormData({ ...formData, type: 'Expense' });
          }

        const transaction = { ...formData, amount: Number(formData.amount), id: uuidv4() }

        setOpen(true);
        addTransaction(transaction);
        setFormData(initialState);
    }

    useEffect(() => {
        if(segment) {
            if(segment.intent.intent === 'add_expense') {
                setFormData({ ...formData, type: 'Expense' });
            } else if(segment.intent.intent === 'add_income') {
                setFormData({ ...formData, type: 'Income'});
            } else if(segment.isFinal && segment.intent.intent === 'create_transaction') {
                return createTransaction();
            } else if(segment.isFinal && segment.intent.intent === 'cancel_transaction') {
                return setFormData(initialState);
            }

            segment.entities.forEach((e) => {
                const category = `${e.value.charAt(0)}${e.value.slice(1).toLowerCase()}`;
                switch (e.type) {
                    case 'amount':
                        setFormData({ ...formData, amount: e.value });
                        break;
                    case 'category':
                        if(categoriesIncome.map((IC) => IC.type).includes(category)) {
                            setFormData({ ...formData, type: 'Income', category });
                        } else if(categoriesExpense.map((IC) => IC.type).includes(category)) {
                            setFormData({ ...formData, type: 'Expense', category });
                        }
                        setFormData({ ...formData, category });
                        break;
                    case 'date':
                        setFormData({ ...formData, date: e.value });
                        break;
                    default:
                        break;
                }
            });

            if(segment.isFinal && formData.amount && formData.category && formData.type && formData.date) {
                createTransaction();
            }
        }
    }, [segment]);

    const selectCategories = formData.type === 'Income' ? categoriesIncome : categoriesExpense;

    return (
        <Grid container spacing={2} >
            <CustomizedSnackbar open={open} setOpen={setOpen} />
            <Grid item xs={12}>
                <Typography align="center" variant="subtitle2" gutterBottom>
                    {segment  && segment.words.map((w) => w.value).join(" ")}
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                        <MenuItem value="Income">Income</MenuItem>
                        <MenuItem value="Expense">Expense</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6}>
                <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                        {selectCategories.map((c) => <MenuItem key={c.type} value={c.type}>{c.type}</MenuItem>)}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6}>
                <TextField type="number" label="Amount" fullWidth value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })}/>
            </Grid>
            <Grid item xs={6}>
                <TextField type="date" label="Date" fullWidth value={formData.date} onChange={(e) => setFormData({ ...formData, date: dateFormat(e.target.value) })}/>
            </Grid>
            <Button className={classes.button} variant="outlined" color="primary" fullWidth onClick={createTransaction}>Create</Button>
        </Grid>
    )
}

export default Form;