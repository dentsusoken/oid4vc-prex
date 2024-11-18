# Presentation Submission

## プロパティ

| パラメータ名                           | データ型 | 必須 | 説明                                                                                                                   |
| -------------------------------------- | -------- | ---- | ---------------------------------------------------------------------------------------------------------------------- |
| id                                     | string   | Yes  | UUID のような一意の値を指定する。                                                                                      |
| definition_id                          | string   | Yes  | Presentation Definition の ID。                                                                                        |
| descriptor_map                         | JSON[]   | Yes  | Input Descriptor Mapping Objects の配列。                                                                              |
| descriptor_map.id                      | string   | Yes  | Presentation Definition に含まれる Input Descriptor Objects の ID。                                                    |
| descriptor_map.format                  | string   | Yes  | 登録済みの [Claim Format Designations](https://identity.foundation/claim-format-registry/#registry) に一致する文字列。 |
| descriptor_map.path                    | string   | Yes  | JSON Path 文字列。                                                                                                     |
| descriptor_map.path_nested             | JSON     | No   | multi-Claim envelope format の存在を示すためのオブジェクト。                                                           |
| descriptor_map.path_nested.id          | string   | Yes  | descriptor_map.id と同様。                                                                                             |
| descriptor_map.path_nested.format      | string   | Yes  | descriptor_map.format と同様。                                                                                         |
| descriptor_map.path_nested.path        | string   | Yes  | descriptor_map.path と同様。                                                                                           |
| descriptor_map.path_nested.path_nested | JSON     | No   | descriptor_map.path_nested と同様。                                                                                    |

[参照: Presentation Exchange 2.0.0](https://identity.foundation/presentation-exchange/)
