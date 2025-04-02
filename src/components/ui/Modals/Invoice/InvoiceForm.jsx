import React from 'react';
import {
    FormControl,
    FormLabel,
    Input,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper
} from '@chakra-ui/react';

const InvoiceForm = ({ invoiceNumber, invoiceDate, setInvoiceNumber, setInvoiceDate }) => {
    return (
        <>
            <FormControl mb={4}>
                <FormLabel>Pořadové číslo faktury</FormLabel>
                <NumberInput
                    value={invoiceNumber}
                    onChange={(valueString) => setInvoiceNumber(parseInt(valueString))}
                    min={0}
                    step={1}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>
            <FormControl>
                <FormLabel>Datum</FormLabel>
                <Input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                />
            </FormControl>
        </>
    );
};

export default InvoiceForm;
