/**
 * 용어 의미
 * flat: 01012345678, 0101234567
 * dash : 010-1234-5678, 010-123-4567
 * 
 * TODO: +82가 붙은 전화번호들에 대한 정의, 파싱
 */

module.exports.flatToDash = function(flat) {
  // 맨 앞 0이 생략되는 경우
  const normalized =
    String(flat[0]) !== '0' ? String('0' + flat) : String(flat);

  const mobile = normalized.split('');

  const first = mobile.splice(0, 3).join('');
  const last = mobile.splice(mobile.length - 4, 4).join('');
  const middle = mobile.join('');

  return `${first}-${middle}-${last}`;
};

module.exports.isDash = function isDash(mobile) {
  return (
    (mobile.length === 13 && mobile.split('-').join('').length === 11) ||
    (mobile.length === 12 && mobile.split('-').join('').length === 10)
  );
};
