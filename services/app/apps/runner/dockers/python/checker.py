import json
import traceback
import time
import sys
import os
import ast
from contextlib import redirect_stdout
from io import StringIO

class Checker:
    def __init__(self):
        self.execution_result = []

    def check_security(self):
        vulnerable = ['subprocess', 'sys', 'pickle', 'socket', 'requests']
        tree = ast.parse(open('check/solution.py').read())

        for node in ast.walk(tree):
            if isinstance(node, ast.ImportFrom | ast.Import):
                if isinstance(node, ast.Import):
                    for pack in node.names:
                        if pack.name in vulnerable:
                            return False
                else:
                    if node.module in vulnerable:
                        return False
        return True

    def call(self):
        original_stdout = sys.stdout
        sys.stdout = StringIO()
        try:
            with open(os.path.join(os.path.dirname(__file__), 'check/asserts.json')) as f:
                args_list = json.load(f)

            # You would need to replace 'solution' with the actual function you want to call.
            # The next line assumes the function is imported from the 'solution' module in the 'check' package.
            from check.solution import solution
            secure = self.check_security()

            if secure:
                for arguments in args_list['arguments']:
                    starts_at = time.monotonic()
                    try:
                        with redirect_stdout(sys.stdout):
                            self.to_output(
                                type='result',
                                value=solution(*arguments),
                                time=self.print_time(starts_at)
                            )
                        sys.stdout.close()
                        sys.stdout = StringIO()
                    except Exception as e:
                        self.to_output(
                            type='error',
                            value=str(e),
                            time=self.print_time(starts_at)
                        )
                        sys.stdout.close()
                        sys.stdout = StringIO()
            else:
                self.execution_result.append({'type': 'error', 'value': 'Usage of forbidden packages found'})
        except Exception as e:
            self.execution_result.append({'type': 'error', 'value': traceback.format_exc()})
        finally:
            sys.stdout = original_stdout
            print(json.dumps(self.execution_result))

    def to_output(self, type='', value='', time=0):
        self.execution_result.append({
            'type': type,
            'time': time,
            'value': value,
            'output': sys.stdout.getvalue()
        })
        sys.stdout = StringIO()

    def print_time(self, starts_at):
        return "{:.7f}".format(time.monotonic() - starts_at)

if __name__ == "__main__":
    checker = Checker()
    checker.call()
