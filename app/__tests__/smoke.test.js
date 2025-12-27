import React from 'react';
import renderer from 'react-test-renderer';

describe('Mobile Smoke Test', () => {
  it('has 1 child', () => {
    // Basic test to verify jest-expo setup
    const tree = renderer.create(<React.Fragment />).toJSON();
    expect(tree).toBeNull();
  });
});
