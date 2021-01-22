const cors = require('cors');
const axios = require('axios');
const convert = require('xml-js');


const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


const getXML = async (req, res) => {

    const xml = await axios.get('https://crm-alice-kharkiv.realtsoft.net/feed/xml?id=2');

    const result1 = JSON.parse(convert.xml2json(xml.data, { compact: true, spaces: 4 })).realties.realty;

    const x = result1?.map((data, i) => {
        return ({
            local_reality_id: i,
            state: data.state?._text,
            city: data.city?._text,
            category: 'Нерухомість/Продаж комерційної нерухомості/Приміщення вільного призначення',
            title: `Продается нежилое помещение ${data.characteristics.total_area?._text} m`,
            description: data.description?._text,
            telephone: '+38 095 369 64 86',
            photos_urls: {
                loc: data.photos_urls.loc,
            },
            characteristics: {
                vulicya: data.street?._text,
                "tip-propoziciyi": 'Від посередника',
                raion: data.district?._text,
                "zagalna-ploshcha": data.characteristics.total_area?._text,
                cina: data.characteristics.price?._text,
            }

        });
    })

    const xxx = {
        _declaration: {
            _attributes: { version: "1.0", encoding: "utf-8" }
        },
        realities: { reality: x, _attributes: { "date-create": new Date().toISOString() } }
    }

    const options = { compact: true, ignoreComment: true, spaces: 4 };
    const result = convert.js2xml(xxx, options);

    res.type('application/xml')
    res.send(result);

}

app.get('/get_xml', getXML)

app.listen(3001, () => {
    console.log(`http://localhost:3001`);
})