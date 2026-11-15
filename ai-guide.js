/**
 * ai-guide.js
 * Comprehensive knowledge base, ritual guide, scientific insights,
 * and AI personalized blessing card generator for Chhath Puja.
 */

const ChhathGuideData = {
    "1": {
        title: "पहला दिन: नहाय-खाय (Nahay-Khay)",
        subtitle: "आत्म-शुद्धि और सात्विक संकल्प का दिन",
        content: `
            <p><strong>विधि व नियम:</strong> नहाय-खाय के दिन व्रती पवित्र नदियों या जलाशयों में स्नान करते हैं। घर की पूरी तरह साफ-सफाई की जाती है।</p>
            <ul>
                <li><strong>भोजन:</strong> मिट्टी या पीतल के बर्तन में सेंधा नमक और शुद्ध घी के साथ अरवा चावल, चने की दाल और लौकी (कद्दू) की सब्जी बनाई जाती है।</li>
                <li><strong>महत्व:</strong> व्रती के भोजन ग्रहण करने के बाद ही परिवार के अन्य सदस्य प्रसाद के रूप में भोजन करते हैं। यह शरीर और मन को 36 घंटे के कठोर व्रत के लिए तैयार करता है।</li>
                <li><strong>विशेष:</strong> इस दिन से घर में प्याज, लहसुन और तामसिक भोजन पूरी तरह वर्जित हो जाता है।</li>
            </ul>
        `
    },
    "2": {
        title: "दूसरा दिन: खरना (Kharna / Lohanda)",
        subtitle: "शुद्ध अंतःकरण और निर्जला उपवास का आरंभ",
        content: `
            <p><strong>विधि व नियम:</strong> खरना के दिन व्रती दिनभर निर्जला उपवास रखते हैं। शाम को सूर्यास्त के बाद विशेष प्रसाद तैयार किया जाता है।</p>
            <ul>
                <li><strong>प्रसाद:</strong> आम की लकड़ी और मिट्टी के नए चूल्हे पर गन्ने के शुद्ध गुड़ और दूध से रसियाव (बखीर / खीर) बनाई जाती है और साथ में घी लगी गेहूं की रोटियां।</li>
                <li><strong>पूजा:</strong> केले के पत्ते पर इस प्रसाद को रखकर सूर्य देव और छठी मइया का स्मरण कर भोग लगाया जाता है। व्रती एकांत में शांतिपूर्वक यह प्रसाद ग्रहण करते हैं।</li>
                <li><strong>36 घंटे का संकल्प:</strong> इस प्रसाद को ग्रहण करने के साथ ही 36 घंटे का अखंड निर्जला उपवास शुरू हो जाता है।</li>
            </ul>
        `
    },
    "3": {
        title: "तीसरा दिन: संध्या अर्घ्य (Sandhya Arghya)",
        subtitle: "अस्ताचलगामी (डूबते) सूर्य को पहला नमन",
        content: `
            <p><strong>विधि व नियम:</strong> यह महापर्व का सबसे उल्लासपूर्ण दिन होता है। घर में शुद्धता से ठेकुआ, कसार, और मौसमी फल तैयार किए जाते हैं।</p>
            <ul>
                <li><strong>दौरा और सूप:</strong> बांस के बने दौड़े और सूप में ठेकुआ, गन्ना, नारियल, शरीफा, संतरा, सुथनी, केला सजाया जाता है और ऊपर दीपक जलाया जाता है।</li>
                <li><strong>घाट यात्रा:</strong> परिवारजन सिर पर दौरा उठाकर पारंपरिक छठ गीत गाते हुए नदी या तालाब के घाट पहुंचते हैं।</li>
                <li><strong>अर्घ्य:</strong> व्रती कमर तक पानी में खड़े होकर पश्चिम दिशा की ओर मुंह कर डूबते हुए भगवान सूर्य को दूध और जल से पहला अर्घ्य देते हैं।</li>
                <li><strong>समानता का संदेश:</strong> छठ दुनिया का इकलौता पर्व है जहाँ पहले डूबते हुए सूर्य को प्रणाम कर उनके पूरे दिन के उपकार के प्रति कृतज्ञता व्यक्त की जाती है।</li>
            </ul>
        `
    },
    "4": {
        title: "चौथा दिन: उषा अर्घ्य व पारण (Usha Arghya & Paran)",
        subtitle: "उदित होते सूर्य की वंदना और व्रत का पूर्ण समापन",
        content: `
            <p><strong>विधि व नियम:</strong> भोर (सुबह लगभग 3:30 बजे) से ही व्रती और श्रद्धालु पुनः घाट पर एकत्र होते हैं।</p>
            <ul>
                <li><strong>उषा अर्घ्य:</strong> जैसे ही पूर्व दिशा में सूर्य की पहली लालिमा प्रस्फुटित होती है, जल में खड़े होकर दूध और गंगाजल की अखंड धार से उगते सूर्य को अर्घ्य दिया जाता है।</li>
                <li><strong>प्रार्थना:</strong> परिवार के आरोग्य, सौभाग्य और संतान की दीर्घायु के लिए छठी मइया से याचना की जाती है।</li>
                <li><strong>पारण:</strong> अर्घ्य के उपरांत व्रती घाट पर ही अदरक और गुड़ या कच्चे चने खाकर 36 घंटे के निर्जला व्रत का पारण करते हैं। इसके बाद सभी में ठेकुआ का महाप्रसाद बांटा जाता है।</li>
            </ul>
        `
    },
    "science": {
        title: "छठ महापर्व का वैज्ञानिक और चिकित्सीय रहस्य",
        subtitle: "प्राचीन ऋषियों द्वारा स्थापित आधुनिक स्वास्थ्य विज्ञान",
        content: `
            <p>छठ केवल धार्मिक अनुष्ठान नहीं, बल्कि प्रकृति और मानव शरीर के बीच संतुलन का एक वैज्ञानिक विज्ञान है:</p>
            <ul>
                <li><strong>फोटोथेरेपी (Sunlight Therapy):</strong> सूर्योदय और सूर्यास्त के समय वायुमंडल की मोटी परत से होकर आने वाली पराबैंगनी किरणें (UV Rays) अत्यंत मंद होती हैं, जबकि अवरक्त किरणें (Infrared rays) प्रचुर मात्रा में होती हैं, जो त्वचा और कोशिकाओं के नवीनीकरण में सहायक हैं।</li>
                <li><strong>बायोरिदम और मेलाटोनिन संतुलन:</strong> सूर्योदय और सूर्यास्त को सीधे देखना पीनियल ग्रंथि (Pineal Gland) को सक्रिय करता है, जिससे मेलाटोनिन और सेरोटोनिन हार्मोन संतुलित होते हैं और अवसाद (Depression) दूर होता है।</li>
                <li><strong>जल विसर्जन प्रभाव (Hydrotherapy):</strong> ठंडे पानी में नाभि या कमर तक खड़े रहने से शरीर का तापमान नियंत्रित होता है, वेगस नर्व (Vagus Nerve) उत्तेजित होती है और आंतरिक रक्त संचार मजबूत होता है।</li>
                <li><strong>प्राकृतिक डिटॉक्स (Detoxification):</strong> 36 घंटे का निर्जला व्रत शरीर के ऑटोफैगी (Autophagy) चक्र को सक्रिय करता है, जिससे मृत कोशिकाएं नष्ट होकर शरीर अंदर से शुद्ध हो जाता है।</li>
            </ul>
        `
    }
};

class ChhathAIGuide {
    constructor() {
        this.initGuideModal();
        this.initBlessingGenerator();
    }

    initGuideModal() {
        const guideModal = document.getElementById('guideModal');
        const openBtn = document.getElementById('openGuideBtn');
        const closeBtn = document.getElementById('closeGuideModal');
        const tabs = document.querySelectorAll('.day-tab');
        const contentBox = document.getElementById('guideContent');

        if (openBtn && guideModal) {
            openBtn.addEventListener('click', () => {
                this.renderGuideDay('1');
                guideModal.showModal();
            });
        }

        if (closeBtn && guideModal) {
            closeBtn.addEventListener('click', () => {
                guideModal.close();
            });
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const day = tab.getAttribute('data-day');
                this.renderGuideDay(day);
            });
        });
    }

    renderGuideDay(dayKey) {
        const data = ChhathGuideData[dayKey];
        const contentBox = document.getElementById('guideContent');
        if (!data || !contentBox) return;

        contentBox.innerHTML = `
            <h3>${data.title}</h3>
            <p style="color: #FFE082; font-style: italic; margin-bottom: 12px;">${data.subtitle}</p>
            ${data.content}
        `;
    }

    initBlessingGenerator() {
        const blessingModal = document.getElementById('blessingModal');
        const openBtn = document.getElementById('openBlessingBtn');
        const closeBtn = document.getElementById('closeBlessingModal');
        const generateBtn = document.getElementById('generateBlessingBtn');
        const downloadBtn = document.getElementById('downloadCardBtn');

        if (openBtn && blessingModal) {
            openBtn.addEventListener('click', () => {
                blessingModal.showModal();
            });
        }

        if (closeBtn && blessingModal) {
            closeBtn.addEventListener('click', () => {
                blessingModal.close();
            });
        }

        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generateBlessing();
            });
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadCard();
            });
        }
    }

    generateBlessing() {
        const nameInput = document.getElementById('userNameInput').value.trim() || 'रणधीर शर्मा व समस्त परिवार';
        const cityInput = document.getElementById('userCityInput').value.trim() || 'बिहार / भारत';
        const wishType = document.getElementById('userWishSelect').value;
        const lang = document.getElementById('languageSelect').value;

        const previewContainer = document.getElementById('blessingCardPreview');
        const recipientEl = document.getElementById('cardRecipient');
        const shlokaEl = document.getElementById('cardShloka');
        const bodyEl = document.getElementById('cardBlessingBody');
        const footerEl = document.getElementById('cardDateLocation');

        // AI Shlokas bank
        const shlokas = {
            health: '॥ ॐ आरोग्यं भास्करादिच्छेत् श्रियमिच्छेद्धुताशनात् ॥',
            family: '॥ ॐ षष्ठी देव्यै च देवेभ्यः सदा सर्वार्थदायिनीम् ॥',
            success: '॥ ॐ आदित्याय विद्महे मार्तण्डाय धीमहि तन्नः सूर्यः प्रचोदयात् ॥',
            devotion: '॥ ॐ घृणिः सूर्य्य आदित्यः नमो नमः ॥'
        };

        // Multi-dialect AI blessings synthesis
        let blessingText = '';

        if (lang === 'bhojpuri') {
            switch (wishType) {
                case 'health':
                    blessingText = `छठी मइया राउर अउर राउर पूरा परिवार के सदा निरोग, स्वस्थ अउर दीघार्यु राखस। सुरुज भगवान के किरपा से घर-दुआर में सुख-शांति के गंगा बहे।`;
                    break;
                case 'family':
                    blessingText = `छठी मइया के असीस से राउर घर-अंगना सदा हंसी-खुशी से गूंजत रहे। लइका-बालक के मंगल होखे, वंश बढ़े अउर परिवार में सदा प्रेम-भाव बनल रहे।`;
                    break;
                case 'success':
                    blessingText = `काँच ही बाँस के बहँगिया, बहँगी लचकत जाए... सुरुज देव राउर मेहनत के पूरा फल देस। रोजगार, ब्यापार आ विद्या में दिन दूना रात चौगुना तरक्की होखे।`;
                    break;
                default:
                    blessingText = `सुरुज देव आ छठी मइया के पावन चरन में साष्टांग नमन। राउर हर मनोकामना पूर्ण होखे, जय छठी मइया!`;
            }
        } else if (lang === 'maithili') {
            switch (wishType) {
                case 'health':
                    blessingText = `छठी मईया ओ सूर्य देवक असीम कृपा सँ अहाँक आ अहाँक संपूर्ण परिवारक काया कंचन सन निर्मल ओ निरोग रहय। आरोग्य ओ दीर्घायु प्राप्त होवय।`;
                    break;
                case 'family':
                    blessingText = `हे छठी मैया, अहाँक आंचल में सभक सुख-शांति सुरक्षित रहय। घर-परिवार में मांगलिक आनंद ओ प्रेम सदासर्वदा बनल रहय।`;
                    break;
                case 'success':
                    blessingText = `सूर्य देवक किरण सदृश अहाँक यश ओ कीर्ति संपूर्ण दिशा में प्रसरित होवय। विद्या, कर्म ओ व्यवसाय में निरंतर उत्कर्ष भेटय।`;
                    break;
                default:
                    blessingText = `उग हे सुरुज देव, कुरु दया दृष्टि... अहाँक सभ मनोरथ सिद्ध होवय। जय छठी मईया!`;
            }
        } else {
            // Hindi
            switch (wishType) {
                case 'health':
                    blessingText = `भगवान भुवन भास्कर और छठी मइया आपके जीवन से समस्त व्याधियों और क्लेशों का नाश करें। आपका संपूर्ण परिवार उत्तम स्वास्थ्य, दीर्घायु और अपार ऊर्जा से परिपूर्ण रहे।`;
                    break;
                case 'family':
                    blessingText = `लोक आस्था के महापर्व छठ की पावन रश्मियां आपके आंगन में सुख, शांति, सौहार्द और संतान सुख की अमृत वर्षा करें। आपका कुल सदा मंगलमय रहे।`;
                    break;
                case 'success':
                    blessingText = `सूर्य देव की अमोघ ऊर्जा आपके मार्ग को आलोकित करे। आपके समस्त संकल्प सिद्ध हों और आपको कर्मक्षेत्र, ज्ञान और प्रतिष्ठा के शिखर पर सफलता मिले।`;
                    break;
                default:
                    blessingText = `छठी मइया के आशीर्वाद से आपके घर में रिद्धि-सिद्धि और संपन्नता का वास हो। ॐ सूर्याय नमः।`;
            }
        }

        recipientEl.innerText = `${nameInput}`;
        shlokaEl.innerText = shlokas[wishType] || shlokas.health;
        bodyEl.innerText = blessingText;
        footerEl.innerText = `कार्तिक शुक्ल षष्ठी | ${cityInput}`;

        previewContainer.classList.remove('hidden');
        window.chhathAudio.playBell(1350);
        window.scene.triggerFlowerRain(25);
    }

    downloadCard() {
        // Print-friendly trigger or html2canvas fallback
        window.print();
    }
}

window.chhathAIGuide = new ChhathAIGuide();
