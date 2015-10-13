# Copyright 2015 Google Inc. All rights reserved.
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
"""Tests for main."""

import unittest2
import webapp2
import webapp2_extras.routes

from base import handlers
import main


class MainTest(unittest2.TestCase):
  """Test cases for main."""

  def _VerifyInheritance(self, routes_list, base_class):
    """Checks that the handlers of the given routes inherit from base_class."""
    router = webapp2.Router(routes_list)
    routes = router.match_routes + router.build_routes.values()
    inheritance_errors = ''
    for route in routes:
      if issubclass(route.__class__, webapp2_extras.routes.MultiRoute):
        self._VerifyInheritance(list(route.get_routes()), base_class)
        continue

      if issubclass(route.handler, webapp2.RedirectHandler):
        continue

      if not issubclass(route.handler, base_class):
        inheritance_errors += '* %s does not inherit from %s.\n' % (
            route.handler.__name__, base_class.__name__)

    return inheritance_errors

  def testRoutesInheritance(self):
    errors = ''
    errors += self._VerifyInheritance(main._ROOT_ROUTE,
                                      handlers.RootHandler)
    if errors:
      self.fail('Some handlers do not inherit from the correct classes:\n' +
                errors)


if __name__ == '__main__':
  unittest2.main()
