export const parseStringToDate = (dateString: string) => {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };
  
  
  export const resEncode = (result, status_code = 200) => {
    let res_body = {
      status_code: status_code,
      message: result.msg ? result.msg : '',
      result: result,
    };
    return res_body;
  };
  