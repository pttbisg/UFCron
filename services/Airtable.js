const airtable = require('airtable');

class Airtable {
    constructor() {
        this.base = new airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);
    }

    /**
     *
     * @param baseTable
     * @param filter
     * @param maxRecords
     * @returns {Promise<*[]>}
     */
    async getRecords({baseTable, filter, maxRecords}) {
        const accumulatedRecords = [];
        try {
            await this.base(baseTable).select({
                maxRecords: maxRecords,
                view: "View All",
                filterByFormula: `${filter}`
            }).eachPage(function page(records, fetchNextPage) {
                records.forEach(function(record) {
                    accumulatedRecords.push(record);
                });
                fetchNextPage();
            });
        } catch (e) {
            console.log(e);
        }
        return accumulatedRecords;
    }

    /**
     *
     * @param baseTable
     * @param airtableId
     * @param updateFields
     * @returns {Promise<Records>}
     */
    async updateRecord({baseTable, airtableId, updateFields = {} }) {
        console.log(updateFields);
        try {
            return this.base(baseTable).update([{
                id: airtableId,
                fields: {
                    ...updateFields
                }
            }]);
        } catch (e) {
            console.log(e);
        }
    }

    /**
     *
     * @returns {Promise<{id: *, TrackingId: *}[]>}
     */
    async getUndeliveredOrders() {
        const baseTable = "Main Shopify Orders (PTTB)";
        const filter = "AND( NOT({LastUpdatedLogisticsStatus}='Delivered'), NOT({TrackingNum}='') )"
        return (await this.getRecords({
            baseTable,
            filter,
            maxRecords: 1
        })).map((record) => {
            return {
                id: record['id'],
                TrackingId: record.get('TrackingNum')
            }
        })
    }

    /**
     *
     * @param airtableId
     * @param status
     * @returns {Promise<Airtable.Records>}
     */
    async updateOrderDeliveryStatus(airtableId, status) {
        try {
            const baseTable = "Main Shopify Orders (PTTB)";
            return this.updateRecord({
                baseTable,
                airtableId,
                updateFields: {
                    LastUpdatedLogisticsStatus: status
                }
            })
        } catch (e){
            console.log(e);
        }

    }
}

module.exports = Airtable;
