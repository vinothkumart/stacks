import React from 'react'
import { render } from 'react-native-testing-library'
import { Stack } from '../src'

import { Placeholder, flattenStyle, flattenChildrenStyle } from './utils'

describe('Stack', () => {
  it('should distribute content vertically', () => {
    const { toJSON } = render(
      <Stack>
        <Placeholder />
        <Placeholder />
      </Stack>,
    )
    const root = toJSON()
    const style = flattenStyle(root)

    expect(style).toEqual({
      flexDirection: 'column',
      alignItems: 'stretch',
      width: '100%',
    })
  })

  it('should center content correctly', () => {
    const { toJSON } = render(
      <Stack align="center">
        <Placeholder />
        <Placeholder />
      </Stack>,
    )
    const root = toJSON()
    const style = flattenStyle(root)

    expect(style).toMatchObject({ alignItems: 'center' })
  })

  it('should align content along the right side correctly', () => {
    const { toJSON } = render(
      <Stack align="right">
        <Placeholder />
        <Placeholder />
      </Stack>,
    )
    const root = toJSON()
    const style = flattenStyle(root)

    expect(style).toMatchObject({ alignItems: 'flex-end' })
  })

  it('should align content along the left side correctly', () => {
    const { toJSON } = render(
      <Stack align="left">
        <Placeholder />
        <Placeholder />
      </Stack>,
    )
    const root = toJSON()
    const style = flattenStyle(root)

    expect(style).toMatchObject({ alignItems: 'flex-start' })
  })

  it('should add no bottom margin to children components if `space` is not passed', () => {
    const { toJSON } = render(
      <Stack>
        <Placeholder />
        <Placeholder />
        <Placeholder />
      </Stack>,
    )
    const root = toJSON()
    const [placeholder1, placeholder2, placeholder3] = flattenChildrenStyle(root)
    const noMargin = { marginBottom: 0 }

    expect(placeholder1).toMatchObject(noMargin)
    expect(placeholder2).toMatchObject(noMargin)
    expect(placeholder3).toMatchObject(noMargin)
  })

  it('should add no bottom margin to children components if `space` equals 0', () => {
    const { toJSON } = render(
      <Stack space={0}>
        <Placeholder />
        <Placeholder />
        <Placeholder />
      </Stack>,
    )
    const root = toJSON()
    const [placeholder1, placeholder2, placeholder3] = flattenChildrenStyle(root)
    const noMargin = { marginBottom: 0 }

    expect(placeholder1).toMatchObject(noMargin)
    expect(placeholder2).toMatchObject(noMargin)
    expect(placeholder3).toMatchObject(noMargin)
  })

  it('should add proper bottom margin to children components if `space` is greater than 0', () => {
    const { toJSON } = render(
      <Stack space={2}>
        <Placeholder />
        <Placeholder />
        <Placeholder />
      </Stack>,
    )
    const root = toJSON()
    const [placeholder1, placeholder2, placeholder3] = flattenChildrenStyle(root)
    const noMargin = { marginBottom: 0 }
    const withMargin = { marginBottom: 8 }

    expect(placeholder1).toMatchObject(withMargin)
    expect(placeholder2).toMatchObject(withMargin)
    expect(placeholder3).toMatchObject(noMargin)
  })

  it('should allow passing custom styles', () => {
    const { toJSON } = render(
      <Stack space={1} align="center" style={{ backgroundColor: '#fff', alignItems: 'flex-end' }}>
        <Placeholder
          style={{ borderWidth: 1, borderColor: '#ddd', marginBottom: 10, marginTop: 20 }}
        />
        <Placeholder style={{ marginBottom: 10, marginTop: 20 }} />
      </Stack>,
    )
    const root = toJSON()
    const style = flattenStyle(root)
    const [placeholder1, placeholder2] = flattenChildrenStyle(root)

    expect(style).toMatchObject({
      backgroundColor: '#fff',
      alignItems: 'center',
    })
    expect(placeholder1).toMatchObject({
      borderWidth: 1,
      borderColor: '#ddd',
      marginBottom: 4,
      marginTop: 0,
    })
    expect(placeholder2).toMatchObject({
      marginBottom: 0,
      marginTop: 0,
    })
  })

  it('should handle multiple Stack components', () => {
    const { toJSON } = render(
      <Stack space={8}>
        <Stack space={2}>
          <Placeholder />
          <Placeholder />
        </Stack>
        <Placeholder />
        <Stack space={4}>
          <Placeholder />
          <Placeholder />
        </Stack>
      </Stack>,
    )
    const root = toJSON()
    const [innerStack1, , innerStack2] = root.children
    const [stack1, placeholder1, stack2] = flattenChildrenStyle(root)
    const [stack1Placeholder1, stack1Placeholder2] = flattenChildrenStyle(innerStack1)
    const [stack2Placeholder1, stack2Placeholder2] = flattenChildrenStyle(innerStack2)

    expect(stack1).toMatchObject({ marginBottom: 32 })
    expect(placeholder1).toMatchObject({ marginBottom: 32 })
    expect(stack2).toMatchObject({ marginBottom: 0 })

    expect(stack1Placeholder1).toMatchObject({ marginBottom: 8 })
    expect(stack1Placeholder2).toMatchObject({ marginBottom: 0 })

    expect(stack2Placeholder1).toMatchObject({ marginBottom: 16 })
    expect(stack2Placeholder2).toMatchObject({ marginBottom: 0 })
  })
})
