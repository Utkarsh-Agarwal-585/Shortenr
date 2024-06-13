
'use client';

import React from 'react';
import 'tailwindcss/tailwind.css';
import { useState } from 'react';
import { UrlShortenerLogo } from '../app/common/url-shortner-logo';

// Define the Url type
interface Url {
  code: string;
  url: string;
  clicked: number;
  expiresAt: string;
}

interface HeroProps {
  urlList: Url[];
}

export default function Test({ urlList }: HeroProps) {
  const [data, setData] = useState<Url[]>(urlList);
  const [newUrl, setNewUrl] = useState('');

  // on submit form call post API
  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const _newUrl = newUrl; //Stores the current value of newUrl
    setNewUrl(''); //Clears the input field after the form is submitted
    try {
      const response = await fetch('/api/urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: _newUrl }),
      });
      if (!response.ok) {
        console.error('Failed to fetch new URL:', response.statusText);
        return;
      }
      const content: Url = await response.json();
      if (content) {
        // add new url above all previous urls
        setData([content, ...data]);
      }
    } catch (error) {
      console.error('An error occurred while submitting the URL:', error);
    }
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg max-w-4xl w-full">
        <div className="mb-8 h-56 flex justify-center items-center">
          <UrlShortenerLogo />
        </div>
        <div className="text-center font-semibold text-text-700 mb-8">
          <h1 className="text-2xl mb-4">Shortenr</h1>
          <p>
            Shortenr is a tool designed to shorten URLs, ensuring they remain active for only 5 minutes.
          </p>
        </div>
        <div className="flex justify-center mb-8">
          <form className="flex flex-col gap-4 w-full max-w-md" onSubmit={handleOnSubmit}>
            <input
              type="text"
              className="p-2 border rounded w-full"
              placeholder="Enter long url..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
            <button type="submit" className="p-2 btn btn-dark mx-2 bg-blue-500 text-white rounded">
              Create Short Url
            </button>
          </form>
          <div className="h-8 w-px bg-gray-300 my-4"></div>
        </div>

        <div className="table-responsive custom-table-responsive">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Long URL</th>
                <th className="border border-gray-300 p-2">Short URL</th>
                <th className="border border-gray-300 p-2">Clicked</th>
              </tr>
            </thead>
            <tbody>
              {data.filter(urlObject => !isExpired(urlObject.expiresAt)).map((urlObject) => (
                <React.Fragment key={urlObject.code}>
                  <tr>
                    <td className="border border-gray-300 p-2">
                      <a href={urlObject.url} target="_blank" rel="noopener noreferrer">
                        {urlObject.url.slice(0, 120)}
                        {urlObject.url.length > 120 ? '...' : ''}
                      </a>
                    </td>
                    <td className="border border-gray-300 p-2">
                      <a target="_blank" href={`/api/${urlObject.code}`} rel="noopener noreferrer">
                        {urlObject.code}
                      </a>
                    </td>
                    <td className="border border-gray-300 p-2">{urlObject.clicked}</td>
                  </tr>
                  <tr className="spacer">
                    <td colSpan={100} className="p-2"></td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


export async function getServerSideProps() {
  // call API on load
  try {
    const res = await fetch(process.env.URL + '/api/urls');

    if (!res.ok) {
      console.error('Failed to fetch URL list:', res.statusText);
      return {
        props: {
          urlList: [],
        },
      };
    }

    const urlList: Url[] = await res.json();
    return {
      props: {
        urlList,
      },
    };
  } catch (error) {
    console.error('An error occurred while fetching the URL list:', error);
    return {
      props: {
        urlList: [],
      },
    };
  }
}
