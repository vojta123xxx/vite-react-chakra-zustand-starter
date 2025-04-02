import React from "react";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useColorModeValue,
} from "@chakra-ui/react";

const DataTable = ({ columns, data, onRowClick, rowHover = true }) => {
    const hoverBg = useColorModeValue("gray.50", "gray.700");

    return (
        <Table variant="striped">
            <Thead>
                <Tr>
                    {columns.map((col) => (
                        <Th key={col.key} textAlign={col.align || "left"}>
                            {col.header}
                        </Th>
                    ))}
                </Tr>
            </Thead>
            <Tbody>
                {data.map((row) => (
                    <Tr
                        key={row.id}
                        onClick={() => onRowClick && onRowClick(row)}
                        _hover={
                            rowHover && {
                                bg: hoverBg,
                                cursor: onRowClick ? "pointer" : "default",
                            }
                        }
                    >
                        {columns.map((col) => (
                            <Td key={col.key} textAlign={col.align || "left"}>
                                {col.render ? col.render(row[col.key], row) : row[col.key]}
                            </Td>
                        ))}
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
};

export default DataTable;
