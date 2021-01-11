import React from 'react';
import ReactDom from 'react-dom';
import { SpeechProvider} from '@speechly/react-client';

import { Provider } from './context/context'
import App from './App';

import './index.css'


ReactDom.render(
    <SpeechProvider appId="899af974-4c99-4dc2-8fb9-c41dd664d407" language="en-US">
        <Provider>
          <App />
        </Provider>
    </SpeechProvider>,
    document.getElementById('root')
);