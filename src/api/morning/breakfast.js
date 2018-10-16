function isDeliveryAvailable(req, res) {
  const { address } = req.body;
  const addressData = address.split(' ');
  let result = {
    msg: 'breakfast임시 api입니다.',
    deliPoli: 1,
    state: false,
  };
  // 일단 서울지역은 모두 새벽배송 가능하다고 체크
  if (addressData[0] === '서울') {
    result.deliPoli = 0;
    result.state = true;
  } else if (addressData[0] === '경기') {
    // 경기지역 체크
    if (
      addressData[1] === '시흥시' ||
      addressData[1] === '남양주시' ||
      addressData[1] === '오산시'
    ) {
      result.deliPoli = 1;
      result.state = false;
    } else if (
      addressData[1] === '안양시' ||
      addressData[1] === '군포시' ||
      addressData[1] === '부천시' ||
      addressData[1] === '의왕시' ||
      addressData[1] === '과천시' ||
      addressData[1] === '수원시' ||
      addressData[1] === '광명시' ||
      addressData[1] === '구리시' ||
      addressData[1] === '의정부시'
    ) {
      result.deliPoli = 0;
      result.state = true;
    } else if (addressData[1] === '용인시') {
      if (addressData[2] === '수지구' || addressData[2] === '기흥구') {
        result.deliPoli = 0;
        result.state = true;
      }
    } else if (addressData[1] === '성남시') {
      result.deliPoli = 0;
      result.state = true;
      if (addressData[2] === '분당구') {
        if (
          addressData[3] === '석운동' ||
          addressData[3] === '율동' ||
          addressData[3] === '하산운동' ||
          addressData[3] === '대장동' ||
          addressData[3] === '동원동'
        ) {
          result.deliPoli = 1;
          result.state = false;
        } else if (addressData[3] === '구미동') {
          result.deliPoli = 0;
          result.state = true;
        }
      } else if (addressData[2] === '수정구') {
        if (
          addressData[3] === '고등동' ||
          addressData[3] === '금토동' ||
          addressData[3] === '상적동'
        )
          result.deliPoli = 1;
        result.state = false;
      } else if (addressData[2] === '중원구') {
        if (addressData[3] === '갈현동') result.deliPoli = 1;
        result.state = false;
      }
    } else if (addressData[1] === '안산시') {
      result.deliPoli = 0;
      result.state = true;
      if (
        addressData[3] === '안산동' ||
        addressData[3] === '수암동' ||
        addressData[3] === '장상동'
      ) {
        result.deliPoli = 1;
        result.state = false;
      }
    } else if (addressData[1] === '화성시') {
      if (
        addressData[2] === '기산동' ||
        addressData[2] === '능동' ||
        addressData[2] === '반송동' ||
        addressData[2] === '병점동' ||
        addressData[2] === '반월동' ||
        addressData[2] === '동탄동' ||
        addressData[2] === '석우동' ||
        addressData[2] === '영천동' ||
        addressData[2] === '오산동' ||
        addressData[2] === '진안동' ||
        addressData[2] === '청계동'
      ) {
        result.deliPoli = 0;
        result.state = true;
      }
    } else if (addressData[1] === '김포시') {
      if (
        addressData[2] === '감정동' ||
        addressData[2] === '걸포동' ||
        addressData[2] === '고촌동' ||
        addressData[2] === '구래동' ||
        addressData[2] === '김포1동' ||
        addressData[2] === '김포2동' ||
        addressData[2] === '마산동' ||
        addressData[2] === '북변동' ||
        addressData[2] === '사우동' ||
        addressData[2] === '운양동' ||
        addressData[2] === '장기동' ||
        addressData[2] === '풍무동'
      ) {
        result.deliPoli = 0;
        result.state = true;
      }
    } else if (addressData[1] === '하남시') {
      if (
        addressData[2] === '신장동' ||
        addressData[2] === '덕풍동' ||
        addressData[2] === '풍산동' ||
        addressData[2] === '창우동' ||
        addressData[2] === '망월동'
      ) {
        result.deliPoli = 0;
        result.state = true;
      }
    } else if (addressData[1] === '고양시') {
      if (addressData[2] === '일산서구') {
        if (
          addressData[3] === '가좌동' ||
          addressData[3] === '덕이동' ||
          addressData[3] === '대화동' ||
          addressData[3] === '일산1동' ||
          addressData[3] === '일산2동' ||
          addressData[3] === '일산3동' ||
          addressData[3] === '주엽1동' ||
          addressData[3] === '주엽2동' ||
          addressData[3] === '주엽동' ||
          addressData[3] === '탄현동'
        ) {
          result.deliPoli = 0;
          result.state = true;
        }
      } else if (addressData[2] === '일산동구') {
        if (
          addressData[3] === '마두1동' ||
          addressData[3] === '마두2동' ||
          addressData[3] === '백석1동' ||
          addressData[3] === '백석2동' ||
          addressData[3] === '식사동' ||
          addressData[3] === '장항1동' ||
          addressData[3] === '장항2동' ||
          addressData[3] === '정발산동' ||
          addressData[3] === '중산동' ||
          addressData[3] === '풍동' ||
          addressData[3] === '풍산동'
        ) {
          result.deliPoli = 0;
          result.state = true;
        }
      } else if (addressData[2] === '덕양구') {
        if (
          addressData[3] === '행신1동' ||
          addressData[3] === '행신2동' ||
          addressData[3] === '행신3동' ||
          addressData[3] === '도내동' ||
          addressData[3] === '화정1동' ||
          addressData[3] === '화정2동' ||
          addressData[3] === '능곡동' ||
          addressData[3] === '성사1동' ||
          addressData[3] === '성사2동' ||
          addressData[3] === '주교동' ||
          addressData[3] === '토당동' ||
          addressData[3] === '화전동'
        ) {
          result.deliPoli = 0;
          result.state = true;
        }
      }
    } else if (addressData[1] === '파주시') {
      if (
        addressData[2] === '동패동' ||
        addressData[2] === '와동동' ||
        addressData[2] === '목동동' ||
        addressData[2] === '다율동' ||
        addressData[2] === '야당동' ||
        addressData[2] === '금촌동'
      ) {
        result.deliPoli = 0;
        result.state = true;
      }
    }
  } else if (addressData[0] === '인천') {
    result.deliPoli = 0;
    result.state = true;
    if (addressData[1] === '강화군') {
      result.deliPoli = 1;
      result.state = false;
    } else if (addressData[1] === '서구') {
      if (
        addressData[2] === '검암동' ||
        addressData[2] === '경서동' ||
        addressData[2] === '금곡동' ||
        addressData[2] === '당하동' ||
        addressData[2] === '대곡동' ||
        addressData[2] === '마전동' ||
        addressData[2] === '백석동' ||
        addressData[2] === '불로동' ||
        addressData[2] === '신현동' ||
        addressData[2] === '심곡동' ||
        addressData[2] === '연희동' ||
        addressData[2] === '왕길동' ||
        addressData[2] === '원당동' ||
        addressData[2] === '가정동' ||
        addressData[2] === '석남동' ||
        addressData[2] === '석남1동' ||
        addressData[2] === '석남2동' ||
        addressData[2] === '석남3동'
      ) {
        result.deliPoli = 0;
        result.state = true;
      } else {
        result.deliPoli = 1;
        result.state = false;
      }
    }
  }

  res.json(result);
}
module.exports = {
  isDeliveryAvailable,
};
