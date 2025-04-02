// Sales.jsx
import  { useState } from 'react'; 
import CustomTabs from "./Tabs"; // upravte cestu podle potřeby
import CompanySelector from "../../../components/CompanySelector";

const Sales = () => {
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);

    const handleCompanySelect = (id) => {
        setSelectedCompanyId(id);
    };

    return (
        <div>
            <h1>Hello World</h1>
            <CompanySelector onCompanySelect={handleCompanySelect} />
            <CustomTabs selectedId={selectedCompanyId} />
        </div>
    );
};

export default Sales;
