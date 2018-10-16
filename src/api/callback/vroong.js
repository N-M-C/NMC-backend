const { deliveryMeta } = require('src/models');
// 배송관련 부릉 콜백 서버

//If you send the response with express's res.json
//you can send the Object directly as application/json encoded response.
async function vroong(req, res) {
  const deliveryData = req.body;
  // 필요한 data만 걸러냄
  const {
    event_type,
    delivery_id,
    client_order_no,
    branch_code,
    submitted_at,
    canceled_at,
    assigned_at,
    agent_name,
    agent_phone,
    unassigned_at,
    picked_up_at,
    delayed_at,
    delivered_at,
  } = deliveryData;
  // 보내줄 response 양식
  let result = {
    result: 'SUCCESS',
    error_message: '',
  };
  // 이제 event type이 SUBMITTED 면 db에 이 데이터가 쌓이게 하면 됨
  if (event_type === 'SUBMITTED') {
    await deliveryMeta
      .create({
        eventType: event_type,
        deliveryId: delivery_id,
        orderId: client_order_no,
        branchCode: branch_code,
        submittedAt: submitted_at,
      })
      .then(() => res.json(result))
      .catch(err => res.json({ result: 'ERROR', error_message: `${err}` }));
  } else {
    // eventType에 따라 바뀔 부분만 바꿔주는 옵션
    const updateOption =
      (assigned_at && {
        assignedAt: assigned_at,
        agentName: agent_name,
        agentPhone: agent_phone,
      }) ||
      (picked_up_at && {
        pickedUpAt: picked_up_at,
        agentName: agent_name,
        agentPhone: agent_phone,
      }) ||
      (unassigned_at && {
        unassignedAt: unassigned_at,
        agentName: null,
        agentPhone: null,
      }) ||
      (delayed_at && {
        delayedAt: delayed_at,
      }) ||
      (delivered_at && {
        deliveredAt: delivered_at,
      }) ||
      (canceled_at && {
        canceledAt: canceled_at,
      });
    const deliveryData = await deliveryMeta.findOne({
      where: {
        deliveryId: delivery_id,
      },
    });
    //type이 submitted가 아닐시에는 데이터값들을 변경시켜 주는식으로 하면 됨
    deliveryData
      .update({
        eventType: event_type,
        ...updateOption,
      })
      .then(() => res.json(result))
      .catch(err => res.json({ result: 'ERROR', error_message: `${err}` }));
  }

  // 배송접수했던 데이터 바탕으로 (delivery_id) 데이터 체크해서 업데이트해준다음 db에 저장해주는 방식으로
  // 로직 구현 필요할듯

  //res.json(result);
}

module.exports = vroong;
