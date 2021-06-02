Feature: As A user I should be able to access Every Accounts

    @TEST-1
    Scenario: Verify that user can see all Everyday accounts types
        Given I open Commbank Home Page
            And I click on "Banking" in top menu
            And I click on "Everyday accounts" section
        Then I should see all types of Everyday accounts

    @TEST-1
    Scenario: Verify that Streamline Basic account monthly account fee is $0
        Given I open Commbank Home Page
            And I click on "Banking" in top menu
            And I click on "Everyday accounts" section
            And I click on Tell me how button in Concession card holders  
        Then I should see monthly account fee is Nil