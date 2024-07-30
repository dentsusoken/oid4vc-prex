/*
 * Copyright (c) 2023 European Commission
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { JSONPath } from 'jsonpath-plus';
import { runCatching } from './kotlin';

/**
 * JSON Path related operations
 */
export class JsonPathOps {
  /**
   * Checks that the provided [path][String] is JSON Path
   */
  static isValid(path: string): boolean {
    const regex = /^\$(\.\w+|\[\d+\])*/;
    return regex.test(path);
  }

  /**
   * Extracts from given [JSON][jsonString] the content
   * at [path][jsonPath]. Returns the value found at the path, if found
   */
  static getJsonAtPath(jsonPath: string, jsonString: string): string | null {
    const result = JSONPath({ path: jsonPath, json: JSON.parse(jsonString) });
    return JSON.stringify(result[0]);
  }
}

export const toJsonPath = (path: string) =>
  runCatching(() => JSONPath({ path: path, json: {} }));

export const toJsonString = (jsonNode: unknown): string =>
  jsonNode ? JSON.stringify(jsonNode) : '';
