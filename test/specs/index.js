import { Component } from 'react'
import PropTypes from 'prop-types'
import { JSDOM } from 'jsdom'
import createPromiseCollector from 'ethical-utility-promise-collector'
import PromiseProvider from '../../src/index.js'
import ProviderConsumer from '../../test/files/provider-consumer.js'

const { window } = new JSDOM('')
const { document, navigator } = window

global.window = window
global.document = document
global.navigator = navigator

const React = require('react')
const { mount } = require('enzyme')
const { renderToString } = require('react-dom/server')

describe('<PromiseProvider/>', () => {
    it('should render promise collector component', async (done) => {
        const promise = createPromiseCollector()
        const wrapper = mount(
            <PromiseProvider promise={promise}>
                <ProviderConsumer />
            </PromiseProvider>
        )

        expect(wrapper.html()).toBe('<loading>Promise</loading>')
        await promise()
        expect(wrapper.html()).toBe('<complete>Promise</complete>')

        done()
    })
    it('should passthrough promises', async () => {
        class BrowserProviderConsumer extends React.Component {
            render() {
                const { promise } = this.context
                return <promise>{promise('Hello World!')}</promise>
            }
        }

        BrowserProviderConsumer.contextTypes = {
            promise: PropTypes.func
        }

        const wrapper = mount(
            <PromiseProvider>
                <BrowserProviderConsumer />
            </PromiseProvider>
        )

        expect(wrapper.html()).toBe('<promise>Hello World!</promise>')
    })
})
