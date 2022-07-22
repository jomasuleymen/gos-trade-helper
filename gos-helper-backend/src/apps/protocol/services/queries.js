const trdAppQuery = (annoId) => {
	return `{
        TrdApp(filter: { buyId: ${annoId} }, limit: 200) {
            id
            buyId
            dateApply
            supplierBinIin
            Supplier {
                fullNameRu
            }
            AppLots {
                appId
                lotId
                price
                amount
                statusId
            }
        }
    }`;
};

const trdBuyQuery = (annoIds) => {
	return `{
        TrdBuy(filter: { id: [${annoIds}] }, limit: 200) {
            id
            numberAnno
            totalSum
            nameRu
            itogiDatePublic
            orgNameRu
            RefTradeMethods {
                symbolCode
            }
            Lots {
                id
                lotNumber
                nameRu
                amount
                count
            }
        }
    }`;
};

module.exports = {
	trdAppQuery,
	trdBuyQuery,
};
