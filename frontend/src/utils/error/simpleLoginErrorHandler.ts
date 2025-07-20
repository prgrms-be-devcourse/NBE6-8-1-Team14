export const simpleLoginErrorHandler = (err: any) => {
    console.log(err);
    alert(`로그인에 실패했습니다. 서버 오류 입니다.`);
}