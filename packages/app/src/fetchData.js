import Airtable from 'airtable';
import m from 'moment';
import 'moment/locale/ca';

Airtable.configure({ apiKey: process.env.AIRTABLE_KEY });

export default async city => {
    const base = Airtable.base("appY1KSidJT2goPzb");
    const records = await base('localmaps')
        .select({ 
            view: "Grid view",
            filterByFormula: `{ciutat} = '${city}'`
        })
        .all();

    const data = records.reduce((acc, curr) => {
        const fields = curr.fields;

        if (Object.keys(fields).length > 0) {
            const pic = fields.imatge_llistat && fields.imatge_llistat.length 
                ? fields.imatge_llistat[0].url 
                : undefined; 
            const row = {
                id: curr.id,
                pic,
                media: fields.media,
                categories: fields.categories,
                coords: { lat: fields.lat, lng: fields.lng },
                text: fields.descripcio,
                title: fields.titol,
                address: fields.direccio,
                cost: fields.preu,
                data: m(fields.data)
            };

            acc.push(row);
        }
        
        return acc;
    }, []);

    return {
        cached: false,
        data
    };    
}