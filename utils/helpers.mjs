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

/**
 * Extracts multiple parameter values from an event object
 * @param {Object} event - Incoming event from agent containing parameters array
 * @param {string[]} params - Array of parameter names to extract from the event
 * @returns {Object.<string, *>} Object where keys are parameter names and values are the parameter values
 */
export const getParams = (event, params) => {
  return Object.fromEntries(
    params.map(p => [p, getParam(event, p)])
  );
};

export const getParam = (event, param) => {
  return event?.parameters?.find((p) => p.name === param)?.value;
}
