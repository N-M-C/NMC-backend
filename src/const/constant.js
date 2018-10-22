const constant = {
    name: 'HOVI',
    category: {
        facility: '시설',
        location: '위치',
        time: '시간',
        fare: '요금',
        symptom: '증상',
        life: '일상',
        etc: '기타',
    },
    hospitalInfo:{
        address: '서울특별시 강남구 일원로 81 (06351) 삼성서울병원'
    },
    open_api_info:{
        access_key: '2ed4ad2b-9c0d-47b5-9694-a88cb6152688',
        open_api_url: 'http://aiopen.etri.re.kr:8000/WiseNLU',
    },
    analysis_code:{
        code1: 'morp',
        code2: 'wsd',
        code3: 'wsd_poly',
        code4: 'ner',
        code5: 'dparse',
        code6: 'srl'
    }

};

module.exports = constant;