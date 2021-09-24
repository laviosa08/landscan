module.exports = {
    passwordAlgorithm: { algorithm: 'sha512' },
    code: {
      success: 200,
      error: {
        internalServerError: 500,
        badRequest: 400,
        unauthorized: 401,
        forbidden: 403,
        notFound: 404,
        conflict: 409
      },
    },
  };