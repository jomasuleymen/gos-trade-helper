const Excel = require("exceljs");
const jsZip = require("jszip");
const START_ROW_INDEX = 7;

async function convert(announcements) {
    const zip = new jsZip();
    for (let anno of announcements) {
        const wb = new Excel.Workbook();
        const ws = wb.addWorksheet("lots");
        addCommonStyle(ws);

        ws.getCell("E2").value = {
            text: anno.numberAnno,
            hyperlink: `https://www.goszakup.gov.kz/ru/announce/index/${anno.id}`,
        };
        ws.getCell("E3").value = anno.endDate;
        ws.getCell("G2").value = anno.Organizer.nameRu;

        lotsToWS(ws, anno.Lots);

        wb.title = anno.Organizer.nameRu;

        const buffer = await wb.xlsx.writeBuffer();
        const fileName = `${anno.endDate.split(" ")[0]}/${anno.numberAnno} ${
            anno.RefTradeMethods.symbolCode
        }.xlsx`;
        zip.file(fileName, buffer);
    }

    const zipBuffer = await zip.generateAsync({
        type: "nodebuffer",
        compression: "DEFLATE",
    });
    return zipBuffer;
}

function lotsToWS(ws, lots) {
    lots.forEach((lot, index) => {
        const plan = lot.Plans[0];

        const amount = parseInt(lot.amount, 10);
        const count = parseInt(lot.count, 10);
        const price = parseInt(amount / count, 10);

        const putDataIndex = START_ROW_INDEX + index;

        ws.insertRow(
            putDataIndex,
            [
                null,
                null,
                null,
                lot.lotNumber,
                lot.nameRu,
                price,
                count,
                amount,
                null,
                null,
                lot.descriptionRu,
                plan ? plan.extraDescRu : "",
                " ",
            ],
            "o+"
        );

        ws.getCell("J" + putDataIndex).value = {
            formula: `I${putDataIndex}*G${putDataIndex}`,
        };

        const { Files } = lot;
        if (Files && Files[0] && Files[0].filePath) {
            ws.getCell("D" + putDataIndex).value = {
                text: lot.lotNumber,
                hyperlink: Files[0].filePath,
            };
        }
    });

    const lastRowIndex = START_ROW_INDEX + lots.length;
    ws.getRow(lastRowIndex).border = null;

    ["H", "J"].forEach((col) => {
        const address = col + lastRowIndex;
        ws.getCell(address).font = {
            bold: true,
            ...ws.getCell("H" + (lastRowIndex - 1)).font,
        };
        ws.getCell(address).numFmt = ws.getCell(
            "H" + (lastRowIndex - 1)
        ).numFmt;
        ws.getCell(address).value = {
            formula: `SUM(${col + START_ROW_INDEX}:${
                col + (lastRowIndex - 1)
            })`,
        };
        ws.getCell(address).border = borderStyle;
        ws.getCell(address).fill = blueStyle;
    });
}

const borderStyle = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
};

const yellowStyle = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFF00" },
    bgColor: { argb: "FFFF00" },
};

const blueStyle = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "00b0f0" },
    bgColor: { argb: "00b0f0" },
};

const centerText = {
    vertical: "middle",
    horizontal: "center",
};

function addCommonStyle(ws) {
    ws.getRow(START_ROW_INDEX - 1).height = 32;
    ws.getRows(1, 9).forEach((row) => {
        row.alignment = centerText;
        row.font = { size: 12, name: "Times New Roman" };
    });

    ws.mergeCells("G2:K4");
    ws.getCell("G2").border = borderStyle;
    ws.getCell("G2").alignment = { ...centerText, wrapText: true };

    [
        {
            address: "D2",
            value: "Объявление",
            fill: yellowStyle,
        },
        {
            address: "D3",
            value: "Срок до",
            fill: yellowStyle,
        },
        {
            address: "E2",
            value: "",
            fill: null,
        },
        {
            address: "E3",
            value: "",
            fill: null,
        },
    ].forEach((el) => {
        const cell = ws.getCell(el.address);
        cell.font = { ...cell.font, bold: true, size: 11 };
        cell.border = borderStyle;
        cell.fill = el.fill;
        cell.value = el.value;
    });

    const table = {
        D: {
            value: "№ Лота",
            width: 20,
            numFmt: null,
        },
        E: {
            value: "Наименование лота",
            width: 27,
            numFmt: null,
        },
        F: {
            value: "Цена",
            width: 15,
            numFmt: `_-* #,##0_-;-* #,##0_-;_-* "-"_-;_-@_-`,
        },
        G: {
            value: "Кол-во и Ед.изм",
            width: 17,
            numFmt: null,
        },
        H: {
            value: "Сумма",
            width: 20,
            numFmt: `_-* #,##0_-;-* #,##0_-;_-* "-"_-;_-@_-`,
        },
        I: {
            value: "Наша цена",
            width: 15,
            numFmt: `_-* #,##0_-;-* #,##0_-;_-* "-"_-;_-@_-`,
        },
        J: {
            value: "Сумма",
            width: 20,
            numFmt: `_-* #,##0_-;-* #,##0_-;_-* "-"_-;_-@_-`,
        },
    };

    Object.entries(table).forEach(([col, data]) => {
        ws.getColumn(col).width = data.width;

        const cell = ws.getCell(`${col}${START_ROW_INDEX - 1}`);
        cell.border = borderStyle;
        cell.fill = yellowStyle;
        cell.value = data.value;

        const belowCell = ws.getCell(`${col}${START_ROW_INDEX}`);
        belowCell.border = borderStyle;
        belowCell.numFmt = data.numFmt;
    });
    ws.getColumn("K").width = 15;
}

module.exports = { convert };
