const axios = require('axios');

class UrbanFox {

    async getTrackingInfo(trackingID) {
        const query = `query _ { my_transaction_info(ref_no: "${trackingID}") { ref_no external_track_no version create_date delivr_date pickup_date dst_postcode src_postcode src_lat src_lng dst_addr dst_addr_line src_addr_line src_name activity_log {activity activity_message activity_date} } }`;

        const payload = {
            method: "POST",
            url: `https://deliver.urbanfox.asia/api/u/interstellar/9l5S1HcaPmmHs1-9Ct45ptnaqRU/gql`,
            data: query,
            headers: {
                "Content-Type": "application/graphql",
            },
        };

        const res = await axios(payload);
        return res.data.data.my_transaction_info.activity_log;
    }
}

module.exports = UrbanFox;
