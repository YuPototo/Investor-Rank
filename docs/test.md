# Test

## Terminology

Unit Test: Test that is free of side effect [0]. Test that requires the setup of a database is not considered a unit test.

Integration Test: Test that considers side effect [0]. A test of a tRPC procedure that requires database is considered a integration test.

End to end test: is a methodology used for ensuring that applications behave as expected and that the flow of data is maintained for all kinds of user tasks and processes [1].

## Test Setup

`Vitest` is used to do unit test and integration test. For the moment, we run unit test and integration test together.

Unit test doesn't require additional setup. Integration test requires the setup of a test db.

### Integration Test Setup

A Postgres container is used to run integration test.

To spawn the container:

1. run `test_db_up`
2. run `test_db_migrate`

To kill the container:

1. run `test_db_down`

## Reference

0 - [Unit testing vs integration testing](https://circleci.com/blog/unit-testing-vs-integration-testing/)

1 - [What is end-to-end testing?](https://circleci.com/blog/what-is-end-to-end-testing/)
