@smoke
Feature: Authentication Checks

  Scenario: Verify error message for locked out user
    Given I navigate to the login view
    When I execute login with "locked_out_user" and "secret_sauce"
    Then I see the authentication error message