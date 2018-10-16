import EnumFactory from '../../lib/util/enum-factory/index.js';

class IndustryEnumFactory extends EnumFactory {
    constructor(items) {
        super(items || [
            {value: 'Automotive', valueDE: 'Automobilindustrie', key: 'AI'},
            {value: 'Banking', valueDE: 'Bankwesen', key: 'BK'},
            {value: 'Construction', valueDE: 'Bauwirtschaft', key: 'BA'},
            {value: 'Education and Research', valueDE: 'Bildung und Forschung', key: 'BF'},
            {value: 'Chemicals and Pharmaceuticals', valueDE: 'Chemie und Pharma', key: 'CF'},
            {value: 'Consulting', valueDE: 'Consulting', key: 'CO'},
            {value: 'Electronics', valueDE: 'Elektronik', key: 'EL'},
            {value: 'Energy and Water Supply', valueDE: 'Energie- und Wasserversorgung', key: 'EW'},
            {value: 'Financial Services', valueDE: 'Financial Services', key: 'FS'},
            {value: 'Hospitality and Tourism', valueDE: 'Gastgewerbe und Tourismus', key: 'GT'},
            {value: 'Health Care', valueDE: 'Gesundheitswesen', key: 'GE'},
            {value: 'Wholesale and Retail', valueDE: 'Groß- und Einzelhandel', key: 'GN'},
            {value: 'IT and Engineering Services', valueDE: 'IT- und Ingenieurdienstleistungen', key: 'IT'},
            {value: 'Consumer Goods (FMCG)', valueDE: 'Konsumgüter (FMCG)', key: 'KO'},
            {value: 'Creative and Advertising', valueDE: 'Kreativ- und Werbeindustrie', key: 'KR'},
            {value: 'Art, Culture and Recreation', valueDE: 'Kunst, Kultur und Erholung', key: 'KU'},
            {value: 'Lifestyle Products', valueDE: 'Lifestyleprodukte', key: 'LI'},
            {value: 'Logistics and Transportation', valueDE: 'Logistik und Transport', key: 'LO'},
            {value: 'Mechanical Engineering', valueDE: 'Maschinenbau und Technik', key: 'MA'},
            {value: 'Media and Entertainment', valueDE: 'Medien und Unterhaltung', key: 'ME'},
            {value: 'Non-Profit', valueDE: 'Non-Profit', key: 'NP'},
            {value: 'Public Sector', valueDE: 'Öffentlicher Sektor', key: 'OS'},
            {value: 'Human Resources', valueDE: 'Personalwesen', key: 'PE'},
            {value: 'Real Estate', valueDE: 'Real Estate', key: 'RE'},
            {value: 'Legal Services', valueDE: 'Rechtsberatung', key: 'RC'},
            {value: 'Heavy Industry', valueDE: 'Schwerindustrie', key: 'SC'},
            {value: 'Software and Internet', valueDE: 'Software und Internet', key: 'SW'},
            // {value: '', valueDE: 'Sonstige Dienstleistungen', key: 'SD'},
            {value: 'Telecommunications', valueDE: 'Telekommunikation', key: 'TL'},
        ]);
    }
}

export default new IndustryEnumFactory();
