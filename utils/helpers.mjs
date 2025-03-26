export const buildResponse = (event, body) => {
  return {
    messageVersion: "1.0",
    response: {
      actionGroup: event.actionGroup,
      function: event.function,
      functionResponse: {
        responseBody: {
          TEXT: {
            body: JSON.stringify(body)
          }
        }
      }
    }
  };
}
