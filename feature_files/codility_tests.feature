Feature: Codility Test Feature

    @TEST-001 @CodilityTest
    Scenario: Verify Query Input and Search button are visible
        Given I open Codility test page
        Then I should see Query Input visible
        Then I should see Search button visible

    @TEST-002 @CodilityTest
    Scenario: Verify that search with empty string is forbidden
        Given I open Codility test page
        When I click Search button
        Then I should see "Provide some query" error in Results

    @TEST-003 @CodilityTest
    Scenario: Verify that at least one value return when enter "isla"
        Given I open Codility test page
        When I enter "isla" in Search query field
            And I click Search button
        Then I should see at least one result in Results

    @TEST-004 @CodilityTest
    Scenario: Verify that user get feedback when there is no result
        Given I open Codility test page
        When I enter "ssdfdsfdsf" in Search query field
            And I click Search button
        Then I should see "No results" in Results  
            And I should see no result returned

    @TEST-005 @CodilityTest
    Scenario: Verify that user get correct result
        Given I open Codility test page
        When I enter "Port Royal" in Search query field
            And I click Search button
        Then I should see "Port Royal" in Results  