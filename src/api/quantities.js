import client from './client'

const base = (userId, op, body) =>
  client.post(`/api/v1/quantities/${op}/${userId}`, body).then(r => r.data)

export const quantityApi = {
  convert: (userId, thisQ, thatQ) =>
    base(userId, 'convert', { thisQuantityDTO: thisQ, thatQuantityDTO: thatQ }),

  compare: (userId, thisQ, thatQ) =>
    base(userId, 'compare', { thisQuantityDTO: thisQ, thatQuantityDTO: thatQ }),

  add: (userId, thisQ, thatQ) =>
    base(userId, 'add', { thisQuantityDTO: thisQ, thatQuantityDTO: thatQ }),

  subtract: (userId, thisQ, thatQ) =>
    base(userId, 'subtract', { thisQuantityDTO: thisQ, thatQuantityDTO: thatQ }),

  multiply: (userId, thisQ, thatQ) =>
    base(userId, 'multiply', { thisQuantityDTO: thisQ, thatQuantityDTO: thatQ }),

  divide: (userId, thisQ, thatQ) =>
    base(userId, 'divide', { thisQuantityDTO: thisQ, thatQuantityDTO: thatQ }),

  getHistory: () =>
    client.get('/api/v1/quantities/history').then(r => r.data),

  getHistoryByOperation: (op) =>
    client.get(`/api/v1/quantities/history/${op}`).then(r => r.data),

  getOperationCount: (op) =>
    client.get(`/api/v1/quantities/count/${op}`).then(r => r.data),

  deleteRecord: (id) =>
    client.delete(`/api/v1/quantities/history/${id}`).then(r => r.data),

  deleteAll: () =>
    client.delete('/api/v1/quantities/history').then(r => r.data),
}
