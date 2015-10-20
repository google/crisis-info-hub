#!/usr/bin/python
# Copyright 2015 the Secure GAE Scaffold Project Authors. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import optparse
import sys
import unittest2

USAGE = """%prog SDK_PATH TEST_PATH <THIRD_PARTY>
Run unit tests for App Engine apps.

SDK_PATH    Path to the SDK installation
TEST_PATH   Path to package containing test modules
THIRD_PARTY Optional path to third party python modules to include."""

def main(sdk_path, test_path, third_party_path=None):
  sys.path.insert(0, sdk_path)
  import dev_appserver
  dev_appserver.fix_sys_path()
  if third_party_path:
    sys.path.insert(0, third_party_path)
  suite = unittest2.loader.TestLoader().discover(test_path,
                                                 pattern='*_test.py')
  unittest2.TextTestRunner(verbosity=2).run(suite)


if __name__ == '__main__':
  sys.dont_write_bytecode = True
  parser = optparse.OptionParser(USAGE)
  options, args = parser.parse_args()
  if len(args) < 2:
    print 'Error: At least 2 arguments required.'
    parser.print_help()
    sys.exit(1)
  SDK_PATH = args[0]
  TEST_PATH = args[1]
  THIRD_PARTY_PATH = args[2] if len(args) > 2 else None
  main(SDK_PATH, TEST_PATH, THIRD_PARTY_PATH)
