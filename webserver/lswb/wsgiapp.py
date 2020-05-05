def run_application(application):
    """Server code."""
    # This is where an application/framework stores
    # an HTTP status and HTTP response headers for the server
    # to transmit to the client
    headers_set = []
    # Environment dictionary with WSGI/CGI variables
    environ = {}

    def start_response(status, response_headers, exc_info=None):
        headers_set[:] = [status, response_headers]

    # Server invokes the 'application' callable and gets back the
    # response body
    result = application(environ, start_response)
    # Server builds an HTTP response and transmit it to the client
    ...


def app(environ, start_response):
    """A barebones WSGI app.

    This is a starting point for your own Web framework
    """
    status = "200 OK"
    response_headers = [("Content-Type", "text/plain")]
    start_response(status, response_headers)

    return [b"Hello world from a simple WSGI application\n"]


if __name__ == "__main__":
    run_application(app)
