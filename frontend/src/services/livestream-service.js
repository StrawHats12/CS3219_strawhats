// todo: add api calls here
const registerStream = async (creatorId) => {
  console.log("Register creator id to get stream key", creatorId)
  const payload = {
    "id":creatorId
  }
  return creatorId;
}
export {registerStream};