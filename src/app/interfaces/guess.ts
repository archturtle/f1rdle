/**
 * The interface for the guess' analysis.
 */
export interface GuessResult {

  /**
   * The name of the guess
   */
  name: string

  /**
   * The year of the guess
   *
   * :param result: The year + (↓ or ↑) depending on guess.
   * :param status: HIGHER if answer is higher than guess, LOWER if answer is lower than guess, and
   *                EQUAL if the guess is equal to the answer.
   */
  year: {
    result: string
    status: string
  }

  /**
   * The winning driver of the guess
   *
   * :param result: The winning driver of the guess.
   * :param status: EQUAL if the guess is equal to the answer.
   */
  driver: {
    result: string
    status: string
  }

  /**
   * The word count of the guess
   *
   * :param result: The word count + (↓ or ↑) depending on guess.
   * :param status: HIGHER if answer is higher than guess, LOWER if answer is lower than guess, and
   *                EQUAL if the answer is equal to the guess.
   */
  wordCount: {
    result: string
    status: string
  }

  /**
   * The number of finishing cars for the race of the guess
   *
   * :param result: The number of finishing cars + (↓ or ↑) depending on guess.
   * :param status: HIGHER if answer is higher than guess, LOWER if answer is lower than guess, and
   *                EQUAL if the answer is equal to the guess.
   */
  finishingCars: {
    result: string
    status: string
  }

}
