const LIMIT = 200;

/* Fragments */
const lotFragment = `fragment LotFragment on Lots {
    lotNumber
	nameRu
	amount
	count
	descriptionRu
	Plans {
		refEnstruCode
		extraDescRu
	}
	Files {
		filePath
	}
}`;

const trdBuyFragment = `fragment TrdBuyFragment on TrdBuy {
    id
    numberAnno
    totalSum
    startDate
    endDate
    Organizer {
        nameRu
        refKopfCode
    }
    RefTradeMethods {
        symbolCode
    }
    Lots{ ...LotFragment }
}${lotFragment}`;

/* make trdbuy query by id */
const makeTrdBuyQuery = ({ trdMethods, signs, statusIds }) => {
	trdMethods = trdMethods?.length ? `refTradeMethodsId: [${trdMethods}]` : "";
	statusIds = statusIds?.length ? `refBuyStatusId: [${statusIds}]` : "";
	signs = signs ? Object.keys(signs) : "";

	return (searchAnnoIds) => `{
            TrdBuy(
                filter: { 
                    id: [${searchAnnoIds}] ${trdMethods} ${statusIds}
                }
                limit: ${LIMIT}){
                    ${signs}
                    ...TrdBuyFragment
            }
        }${trdBuyFragment}`;
};

const queryAnnoIdByNumberAnno = (numberAnno) =>
	`TrdBuy(filter: { numberAnno: "${numberAnno}" }) { id }`;

const queryAnnoIdByLotName = ({ lotName, trdMethods, lastId }) =>
	`Lots(
        filter: {
            nameDescriptionRu: "${lotName}"
            refLotStatusId: [210, 220, 230, 240]
            refTradeMethodsId: [${trdMethods}]
    }
    limit: ${LIMIT}
    after: ${lastId || -1}
    ) { id trdBuyId }`;

module.exports = {
	queryAnnoIdByNumberAnno,
	queryAnnoIdByLotName,
	makeTrdBuyQuery,
	LIMIT,
};
