export default interface IUserUpdateRequestBody {
  body: {
    name: string;
    oldPassword: string;
    newPassword: string;
  };
}
