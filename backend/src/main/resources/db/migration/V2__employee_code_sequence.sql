-- Employee codes (NX-1000, NX-1001, ...) come from a sequence so concurrent creates never collide.
-- Starts at 1000 to stay clear of the dev seed codes NX-0001 to NX-0004.
CREATE SEQUENCE emp_code_seq START WITH 1000 INCREMENT BY 1;
