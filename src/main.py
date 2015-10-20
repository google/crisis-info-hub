# Copyright 2014 the Secure GAE Scaffold Project Authors. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
#     Unless required by applicable law or agreed to in writing, software
#     distributed under the License is distributed on an "AS IS" BASIS,
#     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#     See the License for the specific language governing permissions and
#     limitations under the License.
"""Main application entry point."""

import webapp2

import constants
import handlers


_ROOT_ROUTE = [('/', handlers.RootHandler)]

_CONFIG = {
    # Developers are encouraged to build sites that comply with this (or
    # a similarly restrictive) CSP policy.  In particular, adding directives
    # such as unsafe-inline or unsafe-eval is highly discouraged, as these
    # may lead to XSS attacks.
    'csp_policy': {
        # https://developers.google.com/fonts/docs/technical_considerations
        'font-src':    '\'self\' themes.googleusercontent.com '
                       '*.gstatic.com',
        # Maps, YouTube provide <iframe> based embedding at these URIs.
        'frame-src':   '\'self\' www.google.com www.youtube.com',
        # Assorted Google-hosted APIs.
        'script-src':  '\'self\' *.googleanalytics.com *.google-analytics.com',
        # In generated code from http://www.google.com/fonts
        'style-src':   '\'self\' fonts.googleapis.com *.gstatic.com',
        # Fallback.
        'default-src': '\'self\' *.gstatic.com',
        'report-uri':  '/csp',
        'reportOnly': constants.DEBUG,
    }
}

#################################
# DO NOT MODIFY BELOW THIS LINE #
#################################

app = webapp2.WSGIApplication(
    routes=(_ROOT_ROUTE),
    debug=constants.DEBUG,
    config=_CONFIG)
