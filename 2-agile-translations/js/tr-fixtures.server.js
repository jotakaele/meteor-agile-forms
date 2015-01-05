// TODO El bloque de idiomas deberia ir en la parte general, no en agile-forms
//Inicializamos la base de datos de traducciones.
if (Translations.find().count() === 0) {
    nObj = {
        "_id": "en",
        "datetime": new Date(),
        "source": "fixtures"
    }
    ln = ["de-DE", "de-CH", "am-ET", "hy-AM", "az-AZ", "bjs-BB", "bem-ZM", "bn-IN", "be-BY", "my-MM", "bi-VU", "bs-BA", "br-FR", "bg-BG", "kab-DZ", "kea-CV", "ka-IN", "ca-ES", "cb-PH", "ch-GU", "cs-CZ", "ny-MW", "zh-CN", "zh-TW", "zdj-KM", "cop-EG", "ko-KR", "hr-HR", "da-DK", "dv-MV", "dz-BT", "sk-SK", "sl-SI", "es-ES", "eo-EU", "et-EE", "fn-FNG", "fo-FO", "fi-FI", "fr-FR", "acf-LC", "ht-HT", "crs-SC", "gl-ES", "cy-GB", "gd-GB", "ga-IE", "gv-IM", "ka-GE", "el-GR", "grc-GR", "gu-IN", "ha-NE", "haw-US", "he-IL", "hi-IN", "hu-HU", "id-ID", "en-GB", "aig-AG", "bah-BS", "gcl-GD", "gyn-GY", "vic-US", "jam-JM", "svc-VC", "is-IS", "it-IT", "ja-JA", "jw-ID", "kk-KZ", "km-KM", "rw-RW", "ky-KG", "rn-RN", "ku-TR", "ku-TR", "lo-LA", "la-VA", "lv-LV", "lt-LT", "lb-LU", "mk-MK", "ms-MY", "mg-MG", "mt-MT", "mi-NZ", "mh-MH", "mfe-MU", "men-SL", "mn-MN", "nl-NL", "ne-NP", "niu-NU", "no-NO", "ur-PK", "pau-PW", "pa-IN", "pap-PAP", "ps-PK", "fa-IR", "pis-SB", "pl-PL", "pt-PT", "pov-GW", "pot-US", "qu-PE", "rm-RO", "ro-RO", "ru-RU", "sm-WS", "sg-CF", "sr-RS", "sn-ZW", "si-LK", "syc-TR", "so-SO", "srn-SR", "sw-SZ", "sv-SE", "tl-PH", "th-TH", "tmh-DZ", "ta-LK", "tg-TJ", "te-IN", "tet-TL", "bo-CN", "ti-TI", "tpi-PG", "tkl-TK", "to-TO", "tn-BW", "tr-TR", "tk-TM", "tvl-TV", "uk-UA", "ppk-ID", "uz-UZ", "eu-ES", "vi-VN", "wls-WF", "wo-SN", "xh-ZA", "yi-YD", "zu-ZU", "ar-SA"]
    ln.forEach(function(itemLn) {
        nObj[itemLn] = itemLn
    })
    Translations.insert(nObj)
}
